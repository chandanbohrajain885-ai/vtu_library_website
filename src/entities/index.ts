/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: newsandnotifications
 * Interface for NewsandNotifications
 */
export interface NewsandNotifications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType datetime */
  publicationDate?: Date | string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType url */
  externalLink?: string;
}


/**
 * Collection ID: userguidearticles
 * Interface for UserGuideArticles
 */
export interface UserGuideArticles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType datetime */
  lastUpdated?: Date | string;
  /** @wixFieldType text */
  author?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType image */
  featuredImage?: string;
}
