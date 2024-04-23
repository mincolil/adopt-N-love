import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [productNumber, setProductNumber] = useState();
    const [serviceNumber, setServiceNumber] = useState();
    const [adoptRequestNumber, setAdoptRequest] = useState();

    const handleLoadCartProduct = async () => {
        try {
            await axios.get(`/cartProduct/view-cart`, {
                headers: { Authorization: auth.token },
                withCredentials: true,
            })
                .then((data) => {
                    setProductNumber(data.data.length)
                });
        } catch (err) {
            console.log(err);
        }
    };

    const handleLoadCartService = async () => {
        try {
            await axios.get(`/cartService/view-cart`, {
                headers: { Authorization: auth.token },
                withCredentials: true,
            })
                .then((data) => {
                    setServiceNumber(data.data.length);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const handleLoadAdoptRequest = async () => {
        try {
            await axios.get(`/adopt/getAdoptNotification/all`, {
                headers: { Authorization: auth.token },
                withCredentials: true,
            })
                .then((data) => {
                    setAdoptRequest(data.data.length);
                });
        } catch (err) {
            console.log(err);
        }
    };

    const value = {
        auth,
        productNumber,
        serviceNumber,
        adoptRequestNumber,
        setAuth,
        handleLoadCartProduct,
        handleLoadCartService,
        handleLoadAdoptRequest
    }

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            if (auth.role === undefined) {

                const dataDecode = jwtDecode(localStorage.getItem('token'));

                setAuth({
                    id: dataDecode.id,
                    email: dataDecode.email,
                    role: dataDecode.role,
                    token: localStorage.getItem('token'),
                });
            }
        }
    }, [localStorage.getItem('token')])

    useEffect(() => {
        if (auth.token) {
            handleLoadCartProduct()
            handleLoadCartService()
            handleLoadAdoptRequest()
        }
    }, [auth])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;