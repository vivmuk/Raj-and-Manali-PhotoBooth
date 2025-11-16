
import { AIStyle } from './types';

export const AI_STYLE_PROMPTS: Record<AIStyle, string> = {
  [AIStyle.WATERCOLOR]: 'Transform this photo into a whimsical and soft watercolor painting. Keep the facial features and likeness of the people clear and recognizable.',
  [AIStyle.TWINKLE_STAR]: "Expertly replace the background of this photo with a dreamy 'Twinkle Twinkle Little Star' themed night sky. The background should feature soft, fluffy clouds and gentle, glowing stars, creating a whimsical and serene nursery atmosphere. Keep the subjects in the foreground completely unchanged, ensuring they are cleanly cut out and naturally integrated into the new scene.",
  [AIStyle.BOSTON_WATERCOLOR]: "Transform this photo by replacing the background with a beautiful watercolor painting of the Boston skyline, featuring iconic landmarks like Fenway Park, the Citgo sign, and university campuses. The watercolor style should be soft and artistic. Keep the subjects in the foreground clear, recognizable, and seamlessly blended with the new background.",
  [AIStyle.POP_ART]: "Transform this photo into a vibrant Pop Art masterpiece in the style of Roy Lichtenstein, using bold outlines, bright primary colors, and Ben-Day dots. Ensure the subjects' faces remain recognizable but stylized.",
  [AIStyle.PENCIL_SKETCH]: "Convert this photo into a detailed and realistic pencil sketch. The sketch should have fine lines, subtle shading, and a hand-drawn feel, while preserving the likeness of the subjects.",
  [AIStyle.CARTOON]: "Turn this photo into a fun, friendly cartoon. The style should be reminiscent of modern animated movies, with simplified features, expressive eyes, and vibrant colors, while keeping the subjects clearly recognizable.",
};

export const GOOGLE_PHOTOS_ALBUM_URL = 'https://photos.app.goo.gl/Az1AYNjNWY8h1LrM8';

// 200x200px PNG sticker of the couple
export const COUPLE_STICKER_BASE64 = '';
