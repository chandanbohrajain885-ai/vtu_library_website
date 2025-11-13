/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: E-Resources
 * Interface for EResources
 */
export interface EResources {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  plagiarismDetectionSoftware?: string;
  /** @wixFieldType text */
  resourceList?: string;
  /** @wixFieldType text */
  eBooks?: string;
  /** @wixFieldType text */
  languageLabsAndElearning?: string;
  /** @wixFieldType text */
  eJournals?: string;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  1?: string;
}


/**
 * Collection ID: librarianaccounts
 * Interface for LibrarianAccounts
 */
export interface LibrarianAccounts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  username?: string;
  /** @wixFieldType url */
  collegeUrl?: string;
  /** @wixFieldType text */
  password?: string;
  /** @wixFieldType text */
  librarianName?: string;
  /** @wixFieldType text */
  collegeName?: string;
  /** @wixFieldType text */
  email?: string;
}


/**
 * Collection ID: librarianfileuploads
 * Interface for LibrarianFileUploads
 */
export interface LibrarianFileUploads {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType url */
  fileUrl?: string;
  /** @wixFieldType text */
  uploadType?: string;
  /** @wixFieldType text */
  collegeName?: string;
  /** @wixFieldType text */
  librarianName?: string;
  /** @wixFieldType text */
  librarianEmail?: string;
  /** @wixFieldType text */
  approvalStatus?: string;
  /** @wixFieldType datetime */
  uploadDate?: Date | string;
  /** @wixFieldType datetime */
  approvalDate?: Date | string;
  /** @wixFieldType text */
  superAdminComments?: string;
}


/**
 * Collection ID: newsandnotifications
 * Interface for NewsandEvents
 */
export interface NewsandEvents {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  venue?: string;
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
 * Collection ID: passwordchangerequests
 * Interface for PasswordChangeRequests
 */
export interface PasswordChangeRequests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userIdentity?: string;
  /** @wixFieldType text */
  userType?: string;
  /** @wixFieldType datetime */
  requestDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  newPasswordHash?: string;
  /** @wixFieldType text */
  otpCode?: string;
  /** @wixFieldType datetime */
  otpExpiry?: Date | string;
  /** @wixFieldType text */
  adminComments?: string;
  /** @wixFieldType text */
  collegeName?: string;
  /** @wixFieldType text */
  userEmailForOtp?: string;
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


/**
 * Collection ID: passwordchangerequests
 * Interface for PasswordChangeRequests
 */
export interface PasswordChangeRequests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userIdentity?: string;
  /** @wixFieldType text */
  userType?: string;
  /** @wixFieldType datetime */
  requestDate?: Date | string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType text */
  newPasswordHash?: string;
  /** @wixFieldType text */
  otpCode?: string;
  /** @wixFieldType datetime */
  otpExpiry?: Date | string;
  /** @wixFieldType text */
  adminComments?: string;
  /** @wixFieldType text */
  collegeName?: string;
  /** @wixFieldType text */
  userEmailForOtp?: string;
}
