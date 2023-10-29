const Category = require('../models/Category')

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing name or description'
      })
    }

    const categoryDetails = await Category.create({
      name,
      description
    })
    console.log(categoryDetails)

    return res.status(200).json({
      success: true,
      message: 'Category created successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.showAllTCategories = async (req, res) => {
  try {
    const allCategories = Category.find({}, { name: true, description: true })

    return res.status(200).json({
      success: true,
      message: 'All tags',
      allCategories
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
