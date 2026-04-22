import React from 'react';

// Map category to an emoji for visual appeal
const CATEGORY_EMOJI = {
  burger: '🍔',
  pizza: '🍕',
  sushi: '🍣',
  dessert: '🍰',
  drinks: '🥤',
  other: '🍽️',
};

// Reusable food card used in Menu and Cart pages
const FoodCard = ({ food, onAddToCart, isInCart }) => {
  const emoji = CATEGORY_EMOJI[food.category] || '🍽️';

  return (
    <div className="food-card">
      {/* Emoji image placeholder */}
      <div className="food-card-image">{emoji}</div>

      <div className="food-card-body">
        <h3>{food.name}</h3>
        <p>{food.description || 'No description available.'}</p>

        <div className="food-card-footer">
          <span className="food-price">${food.price.toFixed(2)}</span>
          <span className="category-badge">{food.category}</span>
        </div>

        {/* Out of stock warning */}
        {!food.inStock && (
          <p className="out-of-stock">⚠️ Out of stock</p>
        )}

        {/* Add to cart button - disabled if out of stock */}
        {onAddToCart && (
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: '12px', width: '100%' }}
            onClick={() => onAddToCart(food)}
            disabled={!food.inStock || isInCart}
          >
            {isInCart ? '✓ In Cart' : '+ Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
