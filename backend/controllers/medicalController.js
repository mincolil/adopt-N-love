const MedicalReport = require('../models/MedicalReport');

const createNewMedical = async (req, res) => {
    try {
        const { userId, petId, doctorId, petName, title, content, medicalImage } = req.body;
        const medicalReport = new MedicalReport({
            userId,
            petId,
            doctorId,
            petName,
            title,
            content,
            medicalImage
        });
        const result = await medicalReport.save();
        if (result) {
            res.status(201).json({
                message: `Created ${title}`
            });
        } else {
            res.status(400).json({
                error: "Create fail"
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

const getAllMedical = async (req, res) => {
    //get all medical report
    try {
        const result = await MedicalReport.find();
        if (!result) return res.json({
            error: "No medical report found"
        });
        res.status(200).json(result);
    } catch (error) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

const getMedicalByUserId = async (req, res) => {
    //get medical report by userId
    try {
        const { userId } = req.body;
        const result = await MedicalReport.find({ userId: userId });
        if (!result) return res.json({
            error: "No medical report found"
        });
        res.status(200).json(result);
    } catch (error) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

const getMedicalDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await MedicalReport.findById(id);
        if (!result) return res.json({
            error: "No medical report found"
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}


module.exports = {
    createNewMedical,
    getAllMedical,
    getMedicalByUserId,
    getMedicalDetail
}

const getAllPetMedical = async (req, res) => {
    //get all medical report
    try {
        const result = await MedicalReport.find();
        if (!result) return res.json({
            error: "No medical report found"
        });
        res.status(200).json(result);
    } catch (error) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}

const gePetMedicalDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await MedicalReport.findById(id);
        if (!result) return res.json({
            error: "No medical report found"
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
}