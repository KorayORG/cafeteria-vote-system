describe('Auth placeholder', () => {
  it('should work', () => {
    expect(true).toBe(true);

import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        identityNumber: '12345678901',
        fullName: 'Test User',
        phone: '5000000000',
        password: 'Secret123',
      })
      .expect(201);

  });
});
