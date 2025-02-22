// (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

package org.nlogo.tortoise.compiler

import
  scala.{ annotation, scalajs },
    annotation.meta.field,
    scalajs.js.annotation.{ JSExport, JSExportTopLevel }

import
  org.nlogo.{ core, parse },
    core.{ LiteralParser, LogoList, Model, Nobody => NlogoNobody },
    parse.CompilerUtilities

import
    json.{ JsonLibrary, JsonReader, TortoiseJson },
      JsonLibrary.{ Native => NativeJson, toTortoise },
      TortoiseJson._

import
  scalaz.{ Validation, syntax },
    Validation.FlatMap.ValidationFlatMapRequested,
    syntax.foldable._

@JSExportTopLevel("Converter")
object LiteralConverter {

  private val compiler = new Compiler()

  class WrappedException(@(JSExport @field) val message: String) extends Throwable

  @JSExport
  def stringToJSValue(value: String): AnyRef = {
    nlToJS(StandardLiteralParser.readFromString(value))
  }

  private def nlToJS(value: => AnyRef): AnyRef = {

    import scala.scalajs.js.JSConverters.genTravConvertible2JSRichGenTrav

    def nlValueToJSValue: PartialFunction[AnyRef, AnyRef] = {
      case l: LogoList => l.toList.map(nlValueToJSValue).toJSArray
      case NlogoNobody => Nobody
      case x           => x
    }

    try nlValueToJSValue(value)
    catch {
      case ex: Exception => throw new WrappedException(ex.getMessage)
    }

  }

  private def reqToModelWithRun(req: CompilationRequest, isRunResult: Boolean, procVars: String, runString: String): Model = {
    // The strings to run can end in comments like `; blah blah`, so the `\n` before the `end`s are necessary.
    val newCode = if (isRunResult)
      s"${req.code}\nto-report __run [$procVars] report ($runString\n)end"
    else
      s"${req.code}\nto __run [$procVars] $runString\nend"
    req.copy(code = newCode).toModel
  }

  @JSExport
  def compileRunString(compilationRequest: NativeJson, runString: String, isRunResult: Boolean, procVars: String): String = {
    val parsedReqResult = for {
      tortoiseReq <- JsonReader.read[JsObject](toTortoise(compilationRequest)).leftMap(_.map(s => FailureString(s)))
      parsedReq   <- CompilationRequest.read(tortoiseReq).leftMap(_.map(FailureString))
    } yield parsedReq
    parsedReqResult.fold(
      errors    => throw new WrappedException(errors.map((e) => e).toList.mkString("\n")),
      parsedReq => {
        val compilation = try {
           compiler.compileProcedures(reqToModelWithRun(parsedReq, isRunResult, procVars, runString))
        } catch {
          case ex: Exception => throw new WrappedException(ex.getMessage)
        }
        val runProcs = compilation.compiledProcedures.filter({ case (_, names) => names.contains("__run") })
        runProcs.size match {
          case 1 => runProcs.head._1
          case 0 => throw new WrappedException("The compiler did not return a procedure for the run primitive, but it also did not throw an error.")
          case _ => throw new WrappedException("The compiler returned multiple procedures with the same name for the run primitive.")
        }
    })
  }

}

object StandardLiteralParser extends LiteralParser {

  override def readFromString(string: String): AnyRef =
    CompilerUtilities.readFromString(string)

  override def readNumberFromString(string: String): AnyRef =
    CompilerUtilities.readNumberFromString(string)

}
