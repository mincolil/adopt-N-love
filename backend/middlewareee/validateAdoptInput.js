const yup = require('yup');

const validateAdoptInput = (req, res, next) => {
    try {
        const data = req.body;
        let schema = yup.object().shape({
            userId: yup.string().trim().required('Không nhận được ID người dùng'),
            petId: yup.string().trim().required('Không nhận được ID thú cưng'),
            petName: yup.string().trim().required('Vui lòng nhập tên thú cưng')
                .matches(/^[\p{L}\s]+$/u, 'Tên thú cưng không chứa ký tự đặc biệt'),
            age: yup.number().nullable().moreThan(0, 'Tuổi phải lớn hơn 0'),
            species: yup.string().trim().required('Vui lòng nhập giống loài'),
        })
        schema.validate(data);
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors[0] })
    }
}

const validateUpdateAdopt = (req, res, next) => {
    try {
        const data = req.body;
        let schema = yup.object().shape({
            id: yup.string().trim().required('Không nhận được ID của thú cưng'),
            userId: yup.string().trim().required('Không nhận được ID người dùng'),
            petId: yup.string().trim().required('Không nhận được ID thú cưng'),
            petName: yup.string().trim().required('Vui lòng nhập tên thú cưng')
                .matches(/^[\p{L}\s]+$/u, 'Tên thú cưng không chứa ký tự đặc biệt'),
            age: yup.number().nullable().moreThan(0, 'Tuổi phải lớn hơn 0'),
            species: yup.string().trim().required('Vui lòng nhập giống loài'),
        });
        schema.validate(data);
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors[0] })
        console.log(error);
    }
}

