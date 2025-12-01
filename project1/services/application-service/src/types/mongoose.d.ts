/**
 * Type declarations for mongoose
 * Mongoose 7.x includes its own TypeScript definitions
 * This file helps IDE recognize mongoose types
 */

declare module 'mongoose' {
  import mongoose = require('mongoose');
  export = mongoose;
}
