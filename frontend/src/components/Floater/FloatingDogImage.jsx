import React, { useState, useEffect } from 'react';
import dogImage from '../../images/pet.png';
import { Alert } from 'antd';
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const BASE_URL = "http://localhost:3500";

const onClose = (e) => {
    console.log(e, 'I was closed.');
};

const FloatingDogImage = () => {
    // const context = useAuth();
    // const [hasDiscount, setHasDiscount] = useState(false);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await axios.get(`${BASE_URL}/pet/userId?id=${context.auth.id}`);
    //             const count = res.data.docs.filter(pet => pet.discount > 0).length;
    //             setHasDiscount(count > 0);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     fetchData();
    // }, [context.auth.id]);

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            gap: '10px',
        }}>
            {/* {hasDiscount && (
                <Alert
                    message="Thú cưng của bạn có ưu đãi!"
                    description="Hãy kiểm tra ngay"
                    type="success"
                    showIcon
                    closable
                    onClose={onClose}
                    style={{
                        width: '250px',
                    }}
                />
            )} */}

            <a href="/pet-user" >
                <img src={dogImage} alt="Floating Dog" style={{ width: '130px', height: '160px' }} />
            </a>
        </div>
    );
};

export default FloatingDogImage;
