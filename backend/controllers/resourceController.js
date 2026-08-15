/**
 * Learning Resource controller.
 * Read — open to all authenticated users.
 * Write — admin only.
 */
import LearningResource from '../models/LearningResource.js';
import '../models/Skill.js';

// GET /api/resources?skill=xxx&level=beginner
export async function getResources(request, response, next) {
  try {
    const filter = {};
    if (request.query.skill) filter.skill = request.query.skill;
    if (request.query.level) filter.level = request.query.level;
    if (request.query.platform) filter.platform = new RegExp(request.query.platform, 'i');

    const resources = await LearningResource.find(filter)
      .populate('skill', 'name')
      .sort({ createdAt: -1 })
      .limit(50);
    response.json(resources);
  } catch (error) { next(error); }
}

// GET /api/resources/:id
export async function getResourceById(request, response, next) {
  try {
    const resource = await LearningResource.findById(request.params.id).populate('skill', 'name');
    if (!resource) return response.status(404).json({ message: 'Resource not found.' });
    response.json(resource);
  } catch (error) { next(error); }
}

// POST /api/resources — admin only
export async function createResource(request, response, next) {
  try {
    const { skill, title, platform, url, level } = request.body;
    if (!skill || !title || !url || !level) {
      return response.status(400).json({ message: 'skill, title, url, and level are required.' });
    }
    const resource = await LearningResource.create({ skill, title, platform, url, level });
    response.status(201).json(resource);
  } catch (error) { next(error); }
}

// PUT /api/resources/:id — admin only
export async function updateResource(request, response, next) {
  try {
    const resource = await LearningResource.findByIdAndUpdate(
      request.params.id, { $set: request.body }, { new: true, runValidators: true }
    );
    if (!resource) return response.status(404).json({ message: 'Resource not found.' });
    response.json(resource);
  } catch (error) { next(error); }
}

// DELETE /api/resources/:id — admin only
export async function deleteResource(request, response, next) {
  try {
    const resource = await LearningResource.findByIdAndDelete(request.params.id);
    if (!resource) return response.status(404).json({ message: 'Resource not found.' });
    response.json({ message: 'Resource deleted.' });
  } catch (error) { next(error); }
}
