import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"

const app = express()
app.use(cors())
app.use(express.json())

const prisma = new PrismaClient()

function createToken(id: Number) {
    // @ts-ignore
    return jwt.sign({ id: id }, process.env.My_Secret)
}

async function getUserFromToken(token: string) {
    //@ts-ignore
    const decodedData = jwt.verify(token, process.env.My_Secret)

    const user = await prisma.user.findUnique({
        //@ts-ignore
        where: { id: decodedData.id },
        include: { order: { include: { item: true } } }
    })
    return user
}


app.get('/items', async (req, res) => {
    const items = await prisma.item.findMany()
    res.send(items)
})

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany({ include: { order: { include: { item: true } } } })
    res.send(users)
})

app.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body

    try {
        const hashedPassword = bcrypt.hashSync(password, 8)

        const user = await prisma.user.create({
            data: { name: name, email: email, password: hashedPassword },
            include: { order: { include: { item: true } } }
        })

        res.send({ user, token: createToken(user.id) })

    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: error.message })
    }
})


app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body

    try {

        const user = await prisma.user.findUnique({
            where: { email: email },
            include: { order: { include: { item: true } } }
        })
        // @ts-ignore
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (user && passwordMatch) {
            res.send({ user, token: createToken(user.id) })
        }
        else {
            throw Error('Something wrong!')
        }
    } catch (error) {
        // @ts-ignore
        res.status(400).send({ error: 'User or password invalid' })
    }
})


app.get('/validate', async (req, res) => {
    const token = req.headers.authorization || ''

    try {
        const user = await getUserFromToken(token)
        res.send(user)
    }
    catch (error) {
        //@ts-ignore
        res.status(400).send({ error: 'Invalid Token' })
    }
})

app.get('/items/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const item = await prisma.item.findFirst({ where: { id }, include: { order: { include: { user: true } } } })
        if (item) {
            res.send(item)
        }
        else {
            res.status(404).send({ error: 'Item not found' })
        }
    } catch (error) {
        res.status(400).send({ error: 'Error' })
    }
})


app.get('/users/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const user = await prisma.user.findFirst({ where: { id }, include: { order: { include: { item: true } } } })
        if (user) {
            res.send(user)
        }
        else {
            res.status(404).send({ error: 'User not found' })
        }
    } catch (error) {
        //@ts-ignore
        res.status(400).send({ error: error.message })
    }
})


app.post('/items', async (req, res) => {
    const { title, image } = req.body
    try {
        const newItem = await prisma.item.create({
            data: {
                title,
                image
            }
        })
        res.send(newItem)
    }
    catch (error) {
        //@ts-ignore
        res.status(400).send({ error: error.message })
    }
})


app.post('/orders', async (req, res) => {
    const token = req.headers.authorization || ''
    const { quantity, title } = req.body
    try {
        const user = await getUserFromToken(token)
        const newOrder = await prisma.order.create({
            //@ts-ignore
            data: { quantity, userId: user.id, item: { connect: { title: title } } }
        })
        res.send(newOrder)
    }
    catch (error) {
        //@ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.patch('/users/:id', async (req, res) => {
    const token = req.headers.authorization || ''
    const { name, email, password } = req.body
    const id = Number(req.params.id)
    try {
        const user = await getUserFromToken(token)
        const userToUpdate = await prisma.user.findUnique({ where: { id: id } })

        const hashedPassword = bcrypt.hashSync(password, 8)

        if (user?.id === userToUpdate?.id) {
            const userUpdated = await prisma.user.update({
                where: { id },
                data: { name: name, email: email, password: hashedPassword },
                include: { order: { include: { user: true } } }
            })
            res.send(userUpdated)
        }
        else {
            res.status(400).send({ error: 'Not authorized' })
        }
    }
    catch (error) {
        //@ts-ignore
        res.status(400).send({ error: error.message })
    }
})

app.delete('/orders/:id', async (req, res) => {
    const token = req.headers.authorization || ''
    const id = Number(req.params.id)
    try {
        const user = await getUserFromToken(token)
        const order = await prisma.order.findUnique({ where: { id: id } })

        if (user?.id === order?.userId) {
            const orderToDelete = await prisma.order.delete({ where: { id: id } })
            res.send(orderToDelete)
        }
        else {
            res.status(400).send({ error: 'Not authorized to delete' })
        }
    }
    catch (error) {
        //@ts-ignore
        res.status(400).send({ error: error.message })
    }
})


app.listen(4000, () => {
    console.log('Server running: http://localhost:4000')
})