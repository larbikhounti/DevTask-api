import { Module } from "@nestjs/common";
import { Exceptions } from "./exceptions.execptions";

@Module({
  providers: [Exceptions],
  exports: [Exceptions],
})
export class ExceptionModule {}