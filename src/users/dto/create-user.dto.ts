import { CountryList, Gender } from "src/global/app.enum";
import { CreateUserProfileDto } from "src/user-profiles/dto/create-user-profile.dto";

export class CreateUserDto {
    
    readonly firstName: string;
    readonly middleName?: string;
    readonly lastName: string;
    readonly commonName?: string;
    readonly homeAddress?: string;
    readonly gender?: Gender;
    readonly dateOfBirth?: Date;
    readonly nationality?: CountryList;
    readonly state?: string;
    readonly city?: string
    readonly county?: string
    readonly zip?: string;
    readonly isActive: boolean;
    readonly isSoftDeleted: boolean;
    readonly primaryEmailAddress: string;
    readonly backupEmailAddress?: string;
    readonly phone?: { mobile: string[], office: string[], home: string[] }
    readonly isPrimaryEmailAddressVerified?: boolean;
    readonly isBackupEmailAddressVerified?: boolean;
    passwordHash: string;
    readonly isPasswordChangeRequired?: boolean;
    readonly resetPasswordToken?: string;
    readonly resetPasswordExpiration?: Date;
    readonly primaryEmailVerificationToken?: string;
    readonly backupEmailVerificationToken?: string;
    readonly emailVerificationTokenExpiration?: Date;
    readonly otpEnabled?: boolean;
    readonly otpSecret?: string;
    readonly refreshTokenHash?: string;
    readonly userProfile?: CreateUserProfileDto;
    readonly departmentId?: number;
    

 
    // we may have some cases where we can't make use of read only. An example is the user on the client side entering their password during registeration
    // Normally passwords aren't stored in the db the way they are sent by the user. They are first of all hashed before storage. In our case, we wouldnt want to make the field 
    // readonly so our backend codes, after receiving the values can make modifactions to the value.

}