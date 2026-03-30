class Product {

    constructor (id,title,description,code,price,stock,category,thumbnails,status = true){
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
        this.status = status;
    }

    setId (id){
        this.id = id;
    }

    getId () {
        return this.id;
    }

    setTitle (title){
        this.title = title;
    }

    getTitle () {
        return this.title;
    }

    setDescription (description){
        this.description = description;
    }

    getDescription () {
        return this.description;
    }

    setCode (code){
        this.code = code;
    }

    getCode () {
        return this.code;
    }

    setPrice (price){
        this.price = price;
    }

    getPrice () {
        return this.price;
    }

    setCategory (category){
        this.category = category;
    }

    getCategory () {
        return this.category;
    }

    setThumbnails (thumbnails){
        this.thumbnails = thumbnails;
    }

    getThumbnails () {
        return this.thumbnails;
    }

    setStock (stock){
        this.stock = stock;
    }

    getStock () {
        return this.stock;
    }

    setStatus (status){
        this.status = status;
    }

    getStatus () {
        return this.status;
    }

}

export default Product