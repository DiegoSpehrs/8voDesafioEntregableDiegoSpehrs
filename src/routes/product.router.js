import { Router } from "express";
import { productsController } from "../controllers/products/products.controller.js";
import {userService} from "../services/users/users.service.js"

const router = Router();

router.get('/', productsController.getAllProducts);

router.get('/:pid', productsController.getProductById);

router.post('/', userService.logInAuthentication(['admin']), productsController.addProduct);

router.put('/:pid', userService.logInAuthentication(['admin']), productsController.updateProduct);

router.delete('/:pid', userService.logInAuthentication(['admin']), productsController.productDelete);

router.get('/mokingProducts', (req,res) => {
    const arrPorducts = [];
    for (let i = 0; i < 100; i++) {
        const product = generateProducts();
        arrPorducts.push(product);
    };
    return res.json(arrPorducts);  
});


export default router