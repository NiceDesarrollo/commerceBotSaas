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
exports.TestBotConfigDto = exports.UpdateBotConfigDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateBotConfigDto {
}
exports.UpdateBotConfigDto = UpdateBotConfigDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100, { message: 'El nombre del bot no puede exceder 100 caracteres' }),
    __metadata("design:type", String)
], UpdateBotConfigDto.prototype, "botName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'El estilo de prompt no puede exceder 500 caracteres' }),
    __metadata("design:type", String)
], UpdateBotConfigDto.prototype, "promptStyle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500, { message: 'El mensaje de saludo no puede exceder 500 caracteres' }),
    __metadata("design:type", String)
], UpdateBotConfigDto.prototype, "greeting", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'La temperatura debe ser un número' }),
    (0, class_validator_1.Min)(0, { message: 'La temperatura debe ser mayor o igual a 0' }),
    (0, class_validator_1.Max)(2, { message: 'La temperatura debe ser menor o igual a 2' }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value)),
    __metadata("design:type", Number)
], UpdateBotConfigDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'useImages debe ser un booleano' }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true';
        }
        return Boolean(value);
    }),
    __metadata("design:type", Boolean)
], UpdateBotConfigDto.prototype, "useImages", void 0);
class TestBotConfigDto {
}
exports.TestBotConfigDto = TestBotConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El mensaje de prueba es requerido' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'El mensaje de prueba no puede exceder 1000 caracteres' }),
    __metadata("design:type", String)
], TestBotConfigDto.prototype, "testMessage", void 0);
//# sourceMappingURL=bot-config.dto.js.map