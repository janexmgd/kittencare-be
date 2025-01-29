import express from '../apps/express.js';
import imageUploaderMiddleware from '../middlewares/imageUploader.middleware.js';
import protectRoute from '../middlewares/protectRoute.middleware.js';
import petController from '../controllers/pet.controller.js';
import validate from '../middlewares/validate.js';
import { createPets } from '../validations/schema/pets.schema.js';
const { create } = petController;
const petRouter = express.Router();

petRouter.post(
  '/create',
  protectRoute,
  imageUploaderMiddleware,
  validate(createPets),
  create
);

export default petRouter;
