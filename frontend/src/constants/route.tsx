export const HOME = "/"

export const SHOP = "/shops"

export const REWARD = "/rewards"

export const ABOUT = "/about-us"

export const CONTACT = "/contact-us"

export const PAYMENT = "/payments"

export const PROFILE = "/profile"

export const TERM = "/term"

export const COOKIES = "/cookies"

export const PRIVACY = "/privacy"

export const routes = {
    admin: {
        orders: "/admin/orders",
        payments: "/admin/payments",
        redeemRewards: "/admin/redeem-rewards",
        products: "/admin/products",
        rewards: "/admin/rewards",
        users: "/admin/users"
    },
    user: {
        payments: "/profile/payments",
        orders: "/profile/orders",
        redeems: "/profile/rewards-redeem"
    }
} as const