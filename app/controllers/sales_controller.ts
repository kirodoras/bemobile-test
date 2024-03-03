import type { HttpContext } from '@adonisjs/core/http'
import Sale from '#models/sale'
import Product from '#models/product'

export default class SalesController {
  async store({ request, response }: HttpContext) {
    const data = request.only(['customer_id', 'product_id', 'quantity'])
    const product = await Product.findOrFail(data.product_id)
    const sale = new Sale()
    sale.fill({
      ...data,
      unit_price: product.price,
      total_price: product.price * data.quantity,
    })
    await sale.save()
    return response.status(201).json(sale)
  }
}
