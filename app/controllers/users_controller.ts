// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { HttpContext } from '@adonisjs/core/http'
import * as jwt from './jwt_controller.js'

export default class UsersController {
  async signup({ request, response }: HttpContext) {
    const { email, password } = request.body()
    const user = new User()
    user.email = email
    const exists = await User.findBy('email', user.email)
    if (exists) {
      return {
        response: response.status(400).send({ message: 'User already exists' }),
      }
    }
    user.password = password
    await user.save()
    return {
      response: response.status(201).send({ message: 'User created' }),
    }
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.body()
    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(401).send({ message: 'Invalid user' })
    }
    const match = await hash.verify(user.password, password)
    if (!match) {
      return response.status(401).send({ message: 'Invalid password' })
    }
    const token = jwt.encode({ email: user.email })
    return {
      token: token,
    }
  }
}
