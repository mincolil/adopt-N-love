// FullScreenCarousel.js

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Carousel.css';

const FullScreenCarousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="fullscreen-carousel-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="fullscreen-slide">
            <img src={img} alt={`carousel-item-${index}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FullScreenCarousel;
