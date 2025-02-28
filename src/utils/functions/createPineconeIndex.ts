import { envConstant } from '@constants/index';
import { Logger } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

export async function createPineconeIndex() {
  const pinecone = new Pinecone({
    apiKey: envConstant.PINECONE_API_KEY,
  });

  try {
    // Check if the index exists
    const indexList = await pinecone.listIndexes();
    if (indexList.indexes.some((index) => index.name === 'docuwhisper')) {
      Logger.log('Pinecone Index "docuwhisper" already exists.');
      return;
    }

    await pinecone.createIndex({
      name: 'docuwhisper',
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });

    Logger.log('Pinecone Index "docuwhisper" created successfully');
  } catch (error) {
    Logger.error('Error creating index:', error);
  }
}
