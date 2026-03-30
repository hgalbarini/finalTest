import fs from 'fs/promises';
import Product from './Product.js';

class ProductManager {

    constructor (){
        this.products = [];
        this.path = 'data/products.json';
        this.nextId = 1;
    }


    async initialize() {
        try {
            let existingProducts = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(existingProducts);
            if (this.products.length > 0) {
                // Encontrar el máximo ID actual
                const maxId = Math.max(...this.products.map(p => parseInt(p.id)));
                this.nextId = maxId + 1;
            }
        } catch (error) {
            console.error(`Error initializing ProductManager: ${error.message}`);
            // Si el archivo no existe, crearlo con array vacío
            await this.saveProducts();
        }
    }

    async saveProducts() {
        try {
            let dataToWrite = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, dataToWrite);
        } catch(error) {
            console.error(`Error saving products: ${error.message}`);
        }
    }

    async addProduct(title, description, code, price, stock, category, thumbnails = [], status = true){
        
        // Leer productos existentes
        try {
            await this.initialize();
        } catch (error) {
            console.error(`Error reading file in addProduct: ${error.message}`);
            return false;
        }

        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            console.error("All fields are mandatory (title, description, code, price, stock, category)");
            throw new Error("All fields are mandatory");
        }

        // Validar que no se repita el código
        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.error(`Product with code ${code} already exists`);
            throw new Error(`Product with code ${code} already exists`);
        }

        // Crear producto con ID autoincremental
        const id = this.nextId++;
        let product = new Product(id, title, description, code, price, stock, category, thumbnails, status);
        
        this.products.push(product);
        
        try {
            await this.saveProducts();
            return true;
        } catch(error) {
            console.error(`Error writing the file in addProduct: ${error.message}`);
            return false;
        }
    }


    async getProducts(){
        try {
            await this.initialize();
            return this.products;
        } catch (error){
            console.error (`Error in getProducts: ${error.message}`);
            return [];
        }
    }

    async getProductById(id){
        try {
            await this.initialize();
            const productExists = this.products.some(product => product.id == id);
            if (productExists) {
                const productToReturn = this.products.find(product => product.id == id);
                return productToReturn;
            } else {
                console.error("Not found");
                throw new Error (`Product not found with id: ${id}`);
            }
        } catch (error){
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            await this.initialize();
            const index = this.products.findIndex(product => product.id == id);
            
            if (index === -1) {
                throw new Error(`Product not found with id: ${id}`);
            }

            // No permitir actualizar el ID
            if (updatedFields.id) {
                delete updatedFields.id;
            }

            // Validar que no se repita el código (si se está actualizando)
            if (updatedFields.code) {
                const codeExists = this.products.some(
                    (product, i) => i !== index && product.code === updatedFields.code
                );
                if (codeExists) {
                    throw new Error(`Product with code ${updatedFields.code} already exists`);
                }
            }

            // Actualizar el producto
            this.products[index] = { ...this.products[index], ...updatedFields };
            
            await this.saveProducts();
            return this.products[index];
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            await this.initialize();
            const index = this.products.findIndex(product => product.id == id);
            
            if (index === -1) {
                throw new Error(`Product not found with id: ${id}`);
            }

            this.products.splice(index, 1);
            
            await this.saveProducts();
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default ProductManager