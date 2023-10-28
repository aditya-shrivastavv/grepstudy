const Tag = require('../models/Tag')

exports.createTags = async (res, req) => {
  try {
    const { name, description } = req.body
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing name or description'
      })
    }

    const tagDetails = await Tag.create({
      name,
      description
    })
    console.log(tagDetails)

    return res.status(200).json({
      success: true,
      message: 'Tag created successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.showAllTags = async (res, req) => {
  try {
    const allTags = Tag.find({}, { name: true, description: true })

    return res.status(200).json({
      success: true,
      message: 'All tags',
      allTags
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
