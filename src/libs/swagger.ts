import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

export const configureSwagger = (app) => {
    const swaggerConfig = new DocumentBuilder().setTitle('rentLink V1')
    .setDescription('Comprehensive API documentation for rentlink V1')
    .addBearerAuth(
        {type: 'http',
            scheme: 'bearer', bearerFormat: 'JWT'
        }, 'JWT'
    )
    .addTag('rentlink platform', 'Documentation for the rentlink platform')
    .setExternalDoc('Postman Collection', '/documentation-json')
    .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('/documentation', app, document)
}
