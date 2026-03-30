import fs from 'fs/promises';

class CartManager {
    constructor (){
        this.carts = [];
        this.path = 'data/carts.json';
        this.nextId = 1;
    }

    async initialize() {
        try {
            let existingCarts = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(existingCarts);
            if (this.carts.length > 0) {
                const maxId = Math.max(...this.carts.map(c => parseInt(c.id)));
                this.nextId = maxId + 1;
            }
        } catch (error) {
            console.error(`Error initializing CartManager: ${error.message}`);
            // Si el archivo no existe, crearlo con array vacío
            await this.saveCarts();
        }
    }

    async saveCarts() {
        try {
            let dataToWrite = JSON.stringify(this.carts, null, 2);
            await fs.writeFile(this.path, dataToWrite);
        } catch(error) {
            console.error(`Error saving carts: ${error.message}`);
        }
    }

    async createCart() {
        try {
            await this.initialize();
            
            const newCart = {
                id: this.nextId++,
                products: []
            };
            
            this.carts.push(newCart);
            await this.saveCarts();
            return newCart;
        } catch (error) {
            console.error(`Error creating cart: ${error.message}`);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            await this.initialize();
            const cartExists = this.carts.some(cart => cart.id == id);
            if (cartExists) {
                const cartToReturn = this.carts.find(cart => cart.id == id);
                return cartToReturn;
            } else {
                throw new Error(`Cart not found with id: ${id}`);
            }
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            await this.initialize();
            const cartIndex = this.carts.findIndex(cart => cart.id == cartId);
            
            if (cartIndex === -1) {
                throw new Error(`Cart not found with id: ${cartId}`);
            }

            const cart = this.carts[cartIndex];
            const productIndex = cart.products.findIndex(p => p.product == productId);

            if (productIndex === -1) {
                // Producto no existe en el carrito, agregarlo con quantity = 1
                cart.products.push({
                    product: productId,
                    quantity: 1
                });
            } else {
                // Producto ya existe, incrementar quantity
                cart.products[productIndex].quantity += 1;
            }

            this.carts[cartIndex] = cart;
            await this.saveCarts();
            return cart;
        } catch (error) {
            throw error;
        }
    }
}

export default CartManager;