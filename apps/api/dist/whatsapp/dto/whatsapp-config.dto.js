"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestWhatsappDto = exports.UpdateWhatsappConfigDto = exports.WhatsappConfigDto = void 0;
const class_validator_1 = require("class-validator");
class WhatsappConfigDto {
}
exports.WhatsappConfigDto = WhatsappConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "whatsappPhoneNumberId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "whatsappAccessToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "whatsappWebhookToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['none', 'cloud_api', 'twilio', '360dialog']),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "whatsappProvider", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], WhatsappConfigDto.prototype, "isWhatsappEnabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "twilioAccountSid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "twilioAuthToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsappConfigDto.prototype, "twilioPhoneNumber", void 0);
class UpdateWhatsappConfigDto extends WhatsappConfigDto {
}
exports.UpdateWhatsappConfigDto = UpdateWhatsappConfigDto;
class TestWhatsappDto {
}
exports.TestWhatsappDto = TestWhatsappDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestWhatsappDto.prototype, "testMessage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TestWhatsappDto.prototype, "testPhoneNumber", void 0);
//# sourceMappingURL=whatsapp-config.dto.js.map