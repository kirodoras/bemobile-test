import type { HttpContext } from '@adonisjs/core/http'
import Customer from '#models/customer'
import Sale from '#models/sale'
import Phone from '#models/phone'
import Adress from '#models/adress'
import * as jwt from './jwt_controller.js'

export default class CustomersController {
  async index({ request, response }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    // eslint-disable-next-line unicorn/no-await-expression-member
    const customers = (await Customer.all()).sort((a, b) => a.id - b.id)
    const customersArray = customers.map((customer) => {
      return {
        id: customer.id,
        name: customer.name,
        cpf: customer.cpf,
      }
    }, [])
    return response.status(200).send(customersArray)
  }

  async show({ request, response, params }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { id } = params
    const customer = await Customer.findOrFail(id)
    const sales = await Sale.all()
    // ordenar pela data
    const salesArray = sales.filter((sale) => sale.customer_id === customer.id)
    return response.status(200).send({
      id: customer.id,
      name: customer.name,
      cpf: customer.cpf,
      sales: salesArray,
    })
  }

  async store({ request, response }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, cpf, phone_number, country, state, street, number } = request.body()
    const customer = new Customer()
    customer.name = name
    customer.cpf = cpf
    const exists = await Customer.findBy('cpf', customer.cpf)
    if (exists) {
      return response.status(400).send({ message: 'Customer already exists' })
    }
    const { id } = await customer.save()
    const phone = new Phone()
    phone.customer_id = id
    phone.phone_number = phone_number
    await phone.save()
    const adress = new Adress()
    adress.customer_id = id
    adress.country = country
    adress.state = state
    adress.street = street
    adress.number = number
    await adress.save()
    return response.status(201).send({ message: 'Customer created' })
  }

  async update({ request, response, params }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { id } = params
    const { name, cpf } = request.body()
    const customer = await Customer.findOrFail(id)
    customer.name = name
    customer.cpf = cpf
    await customer.save()
    return response.status(200).send({ message: 'Customer updated' })
  }

  async delete({ request, response, params }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { id } = params
    const customer = await Customer.findOrFail(id)
    await customer.delete()
    return response.status(200).send({ message: 'Customer deleted' })
  }

  async authorize(authorization: any) {
    if (!authorization) {
      return false
    }
    return jwt.authorize(authorization)
  }
}
