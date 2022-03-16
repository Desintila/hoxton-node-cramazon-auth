import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


const users: Prisma.UserCreateInput[] = [
    {
        name: 'Fjona',
        email: 'fjona@email.com',
        password: 'fjona1234'
    },
    {
        name: 'Deni',
        email: 'deni@email.com',
        password: 'deni1234'
    },
    {
        name: 'Ana',
        email: 'ana@email.com',
        password: 'ana1234'
    },
    {
        name: 'Arbi',
        email: 'arbi@email.com',
        password: 'arbi1234'
    }
]

const items: Prisma.ItemCreateInput[] = [
    {
        title: 'jumper',
        image: 'https://7esl.com/wp-content/uploads/2017/12/jumper-310x310.png'
    },
    {
        title: 'hoodie',
        image: 'https://7esl.com/wp-content/uploads/2017/12/hoodie-310x310.png'
    },
    {
        title: 'sneakers',
        image: 'https://7esl.com/wp-content/uploads/2017/12/sneakers-310x310.png'
    },
    {
        title: 'high heels',
        image: 'https://7esl.com/wp-content/uploads/2017/12/high-heels-310x310.png'
    },
    {
        title: 'dress',
        image: 'https://7esl.com/wp-content/uploads/2017/12/dress-310x310.png'
    },
    {
        title: 'cap',
        image: 'https://7esl.com/wp-content/uploads/2017/12/cap-310x310.png'
    },
    {
        title: 'scarf',
        image: 'https://7esl.com/wp-content/uploads/2017/12/scarf-2-310x310.png'
    }
]


const orders: Prisma.OrderCreateInput[] = [
    {
        quantity: 1,
        user: { connect: { email: 'fjona@email.com' } },
        item: { connect: { title: 'jumper' } },
    },
    {
        quantity: 3,
        user: { connect: { email: 'fjona@email.com' } },
        item: { connect: { title: 'dress' } },
    },
    {
        quantity: 5,
        user: { connect: { email: 'deni@email.com' } },
        item: { connect: { title: 'hoodie' } },
    },
    {
        quantity: 2,
        user: { connect: { email: 'deni@email.com' } },
        item: { connect: { title: 'sneakers' } },
    },
    {
        quantity: 4,
        user: { connect: { email: 'ana@email.com' } },
        item: { connect: { title: 'scarf' } },
    },
    {
        quantity: 1,
        user: { connect: { email: 'arbi@email.com' } },
        item: { connect: { title: 'cap' } },
    },
    {
        quantity: 2,
        user: { connect: { email: 'arbi@email.com' } },
        item: { connect: { title: 'sneakers' } },
    },
    {
        quantity: 12,
        user: { connect: { email: 'ana@email.com' } },
        item: { connect: { title: 'high heels' } },
    },
    {
        quantity: 10,
        user: { connect: { email: 'fjona@email.com' } },
        item: { connect: { title: 'high heels' } },
    },
    {
        quantity: 3,
        user: { connect: { email: 'deni@email.com' } },
        item: { connect: { title: 'cap' } },
    }
]


async function createStuff() {
    for (const user of users) {
        await prisma.user.create({ data: user })
    }
    for (const item of items) {
        await prisma.item.create({ data: item })
    }
    for (const order of orders) {
        await prisma.order.create({ data: order })
    }
}

createStuff()