const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Yair',
        email: 'yair.haraz@example.com',
        password: 'MyPass765!'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Yair',
            email: 'yair.haraz@example.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyPass765!')

})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'MyPass765!'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Yaya'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Yaya')
})

test('Should not updateinvalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Tel Aviv'
        })
        .expect(400)
})

test('Should not signup user with password', async () => {
    const response = await request(app).post('/users').send({
        name: 'Adam',
        email: 'adam@example.com',
        password: 'mypass'
    })
        .expect(400)
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not signup user with invalid name', async () => {
    const response = await request(app).post('/users').send({
        email: 'adam@example.com',
        password: 'mypass'
    })
        .expect(400)
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not signup user with invalid email', async () => {
    const response = await request(app).post('/users').send({
        name: 'Adam',
        email: '@example.com',
        password: 'mypass'
    })
        .expect(400)
    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Dumdum'
        })
        .expect(401)
})

test('Should not update user with invalid name/email/password', async () => {
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            email: 'dumdum.com'
        })
        .expect(400)
    const user = await User.findById(userOneId)
    expect(user.email).not.toEqual(response.body.email)
})

test('Should not delete user if unauthenticated', async ()=> {
    await request(app).delete('/users/me').send().expect(401)
})