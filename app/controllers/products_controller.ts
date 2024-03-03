import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import * as jwt from './jwt_controller.js'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    // eslint-disable-next-line unicorn/no-await-expression-member
    const products = (await Product.all()).sort((a, b) => (a.name < b.name ? -1 : 1))
    const productsArray = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
      }
    })
    return response.status(200).send(productsArray)
  }

  async show({ request, response, params }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { id } = params
    const product = await Product.findOrFail(id)
    return response.status(200).send(product)
  }

  async store({ request, response }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { name, price } = request.body()
    const exists = await Product.findBy('name', name)
    if (exists) {
      return response.status(400).send({ message: 'Product already exists' })
    }
    const product = new Product()
    product.name = name
    product.price = price
    await product.save()
    return response.status(201).send({ message: 'Product created' })
  }

  async update({ request, response, params }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { id } = params
    const { name, price } = request.body()
    const product = await Product.findOrFail(id)
    product.name = name
    product.price = price
    await product.save()
    return response.status(200).send({ message: 'Product updated' })
  }

  async delete({ request, response, params }: HttpContext) {
    const auth = await this.authorize(request.headers().authorization)
    if (!auth) {
      return response.status(401).send({ message: 'Unauthorized' })
    }
    const { id } = params
    const product = await Product.findOrFail(id)
    product.is_deleted = true
    await product.save()
    return response.status(200).send({ message: 'Product deleted' })
  }

  async authorize(authorization: any) {
    if (!authorization) {
      return false
    }
    return jwt.authorize(authorization)
  }
}
