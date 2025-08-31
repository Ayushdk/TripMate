const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
}

export async function getDestinationImage(destination: string): Promise<string | null> {
  console.log('Attempting to fetch image for destination:', destination);
  console.log('Unsplash API key available:', !!UNSPLASH_ACCESS_KEY);
  
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found. Please add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your .env.local file');
    return null;
  }

  try {
    // Extract the main city/country from the destination
    const searchQuery = destination.split(',')[0].trim();
    console.log('Searching for:', searchQuery);
    
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery + ' city landscape')}&orientation=landscape&per_page=1`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error response:', errorText);
      throw new Error(`Unsplash API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    
    if (data.results && data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
      console.log('Found image URL:', imageUrl);
      return imageUrl;
    }

    console.log('No images found for query:', searchQuery);
    return null;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return null;
  }
}

export async function getMultipleDestinationImages(destination: string, count: number = 3): Promise<string[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found. Please add NEXT_PUBLIC_UNSPLASH_ACCESS_KEY to your .env.local file');
    return [];
  }

  try {
    // Extract the main city/country from the destination
    const searchQuery = destination.split(',')[0].trim();
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery + ' city landscape')}&orientation=landscape&per_page=${count}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results.map((photo: any) => photo.urls.regular);
    }

    return [];
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
}
