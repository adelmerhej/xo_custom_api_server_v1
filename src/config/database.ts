import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface DatabaseConfig {
  connectDB(): Promise<void>;
  disconnectDB(): Promise<void>;
}

class Database implements DatabaseConfig {
  private connectionRetries = 0;
  private maxRetries = 5;
  private retryDelay = 5000; // 5 seconds

  /**
   * Connect to MongoDB with retry logic
   */
  async connectDB(): Promise<void> {
    try {
      const mongoUri =
        process.env.MONGODB_URI || "mongodb://localhost:27017/express-auth-api";

      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
      };

      await mongoose.connect(mongoUri, options);

      console.log("✅ MongoDB connected successfully");
      this.connectionRetries = 0; // Reset retry counter on successful connection

      // Handle connection events
      this.setupConnectionEventHandlers();
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      await this.handleConnectionError();
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnectDB(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("📴 MongoDB disconnected successfully");
    } catch (error) {
      console.error("❌ Error disconnecting from MongoDB:", error);
      throw error;
    }
  }

  /**
   * Handle connection errors with retry logic
   */
  private async handleConnectionError(): Promise<void> {
    this.connectionRetries++;

    if (this.connectionRetries <= this.maxRetries) {
      console.log(
        `🔄 Retrying MongoDB connection... (${this.connectionRetries}/${this.maxRetries})`
      );
      console.log(
        `⏳ Waiting ${this.retryDelay / 1000} seconds before retry...`
      );

      await new Promise((resolve) => setTimeout(resolve, this.retryDelay));

      // Exponential backoff: increase delay for next retry
      this.retryDelay = Math.min(this.retryDelay * 1.5, 30000); // Max 30 seconds

      await this.connectDB();
    } else {
      const error = new Error(
        `Failed to connect to MongoDB after ${this.maxRetries} attempts`
      );
      console.error("💥 Maximum connection retries exceeded");
      throw error;
    }
  }

  /**
   * Set up MongoDB connection event handlers
   */
  private setupConnectionEventHandlers(): void {
    // Connection successful
    mongoose.connection.on("connected", () => {
      console.log("🔗 Mongoose connected to MongoDB");
    });

    // Connection error
    mongoose.connection.on("error", (error) => {
      console.error("❌ Mongoose connection error:", error);
    });

    // Connection disconnected
    mongoose.connection.on("disconnected", () => {
      console.log("📴 Mongoose disconnected from MongoDB");
    });

    // Application termination
    process.on("SIGINT", async () => {
      try {
        await this.disconnectDB();
        console.log("👋 Application terminated gracefully");
        process.exit(0);
      } catch (error) {
        console.error("❌ Error during graceful shutdown:", error);
        process.exit(1);
      }
    });
  }

  /**
   * Get current connection status
   */
  getConnectionStatus(): string {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return (
      states[mongoose.connection.readyState as keyof typeof states] || "unknown"
    );
  }

  /**
   * Check if database is connected
   */
  isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

// Create and export database instance
const database = new Database();

export default database;
export { Database };
