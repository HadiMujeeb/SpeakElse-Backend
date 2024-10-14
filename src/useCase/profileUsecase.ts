import ProfileRepository from "../infrastructure/repositories/profileRepository";

export default class ProfileUsecase {
  private profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async editProfile(userId: string, name: string, country: string, profession: string) {
    try {
      // Check if the user exists
      const existingUser = await this.profileRepository.getUserById(userId);

      if (!existingUser) {
        return {
          status: 404,
          message: "User not found",
        };
      }

      // Update the user's profile
      const updatedUser = await this.profileRepository.editProfile(userId, name, country, profession);

      return {
        status: 200,
        message: "Profile updated successfully",
        user: updatedUser, // Return the updated user details
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        status: 500,
        message: "Failed to update profile",
      };
    }
  }
}
