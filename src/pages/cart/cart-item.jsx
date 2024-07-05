import React, { useContext } from "react";
import { ShopContext } from "../../context/shop-context";



export const CartItem = (props) => {
    const { id, productName, price, ProductImage, category, type, } = props.data;
    const { cartItems, addToCart, removeFromCart, updateCartItemCount } = useContext(ShopContext);

    return (
        <div className="cartItem">
            <img src={ProductImage} />
            <div className="description">

                <h1>
                    <b>{category}</b>
                </h1>

                <p>
                    <b>{type}</b>
                </p>

                <p>
                    <b> {productName} </b>
                </p>
                <p> Ksh {price} </p>

                <div className="countHandler">
                    <button onClick={() => removeFromCart(id)} >-</button>
                    <input value={cartItems[id]} onChange={(e) => updateCartItemCount(Number(e.target.value), id)} />
                    <button onClick={() => addToCart(id)} >+</button>
                </div>
            </div>
        </div>
    );
};