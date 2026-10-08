import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'GrowPak Store API',
    version: '1.0.0',
    description: 'Production-grade, modular Express API for GrowPak Store Agri-Commerce Platform',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local development server',
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          200: { description: 'API is running and healthy' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register customer or vendor account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  phone: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  isVendorApplication: { type: 'boolean' },
                  storeName: { type: 'string' },
                },
                required: ['firstName', 'lastName', 'phone', 'password'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login by phone/email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  loginIdentifier: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['loginIdentifier', 'password'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful with JWT tokens' },
        },
      },
    },
    '/shipping/calculate': {
      post: {
        summary: 'Calculate weight-based shipping with overrides',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: { type: 'array' },
                  isFieldAgentOrder: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Shipping calculation breakdown' },
        },
      },
    },
  },
};

export const setupSwagger = (router: Router) => {
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
