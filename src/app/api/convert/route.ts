import { NextResponse } from 'next/server';
import { vectorize } from '@neplex/vectorizer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({ error: 'No se procesó ninguna imagen.' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call VTracer binding via @neplex/vectorizer
    const svgContent = await vectorize(buffer);

    return NextResponse.json({ svg: svgContent });
  } catch (error: any) {
    console.error('Error vectorizing image:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al procesar la imagen (verifique el formato soportado).' },
      { status: 500 }
    );
  }
}
