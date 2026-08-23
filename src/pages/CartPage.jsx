import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Seo from '../components/Seo'
import CartCheckoutModal from '../components/CartCheckoutModal'
import { useCart } from '../context/CartContext'
import { formatOrderTotalPkr } from '../utils/penPricing'
import { formatLineTotal } from '../utils/orderPricing'

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <>
      <Seo
        title="Your Cart | The Paper Story"
        description="Review diaries and pens in your cart. Pay online for free delivery within Pakistan."
        path="/cart"
      />
      <PageHeader
        title="Your Cart"
        subtitle={
          itemCount > 0
            ? `${itemCount} item${itemCount === 1 ? '' : 's'} · Pay online · Free delivery in Pakistan`
            : 'Add diaries and pens from our stationary collection.'
        }
        breadcrumb="Home / Cart"
      />

      <section className="bg-paperstory-cream py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
              <p className="mb-2 font-serif text-xl font-semibold text-paperstory-maroon">
                Your cart is empty
              </p>
              <p className="mb-6 text-sm leading-relaxed text-paperstory-ink/70">
                Browse our diaries and cute kawaii pens — order directly on the website with free delivery.
              </p>
              <Link to="/shop/stationary-items/diaries" className="cute-btn-primary inline-flex">
                Shop diaries & pens
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="cart-line-item flex gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="h-24 w-20 shrink-0 rounded-xl object-cover bg-paperstory-blush/30"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-serif text-base font-semibold text-paperstory-ink sm:text-lg">
                        {item.name}
                      </h2>
                      <p className="mt-0.5 text-xs text-paperstory-ink/60">{item.category}</p>
                      <p className="mt-1 text-sm font-semibold text-paperstory-maroon">
                        {item.price}
                        {item.priceNote && (
                          <span className="ml-2 text-xs font-medium text-paperstory-maroon/80">
                            · {item.priceNote}
                          </span>
                        )}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="cart-qty-control">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-qty-value">{item.quantity}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-paperstory-ink">
                          {formatLineTotal(item)}
                        </span>
                        <button
                          type="button"
                          className="text-xs font-medium text-paperstory-ink/55 underline-offset-2 hover:text-paperstory-maroon hover:underline"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="font-serif text-lg font-semibold text-paperstory-ink">Subtotal</span>
                  <span className="text-lg font-bold text-paperstory-maroon">
                    {formatOrderTotalPkr(total)}
                  </span>
                </div>
                <p className="mb-5 text-xs leading-relaxed text-paperstory-ink/65">
                  Complete payment online to get free delivery within Pakistan. We&apos;ll confirm your order by email.
                </p>
                <button
                  type="button"
                  className="cute-btn-primary w-full"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Checkout · {formatOrderTotalPkr(total)}
                </button>
                <Link
                  to="/shop/stationary-items/diaries"
                  className="mt-3 block text-center text-xs font-medium text-paperstory-maroon underline-offset-2 hover:underline"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {checkoutOpen && (
        <CartCheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => setCheckoutOpen(false)}
        />
      )}
    </>
  )
}
