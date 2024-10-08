import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
  name: 'firstBucket',
  isDefault: true,
  access: (allow) => ({
    'media/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  })
});

export const secondBucket = defineStorage({
  name: 'secondBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})