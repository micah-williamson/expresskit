import {GET, Rule, RuleHandler, Resource, Resolver, Router, Response} from '../../../index';
import {ResponseCode, ErrorCode} from '../../../index';

export class ResponseService {
  @RuleHandler('ErrorRule')
  @ErrorCode(402)
  public static errorRule(): Promise<any> {
    return Promise.reject('bar');
  }

  @Resolver('ErrorResource')
  @ErrorCode(402)
  public static errorResource(): Promise<any> {
    return Promise.reject('bar');
  }
}

@Router('/response')
export class ResponseRouter {
    @GET('/default/ok')
    public static responseOk() {
      return Response.Ok()
    }

    @GET('/default/created')
    public static responseCreated() {
      return Response.Created();
    }

    @GET('/default/accepted')
    public static responseAccepted() {
      return Response.Accepted();
    }

    @GET('/default/none')
    public static responseNone() {
      return Response.None();
    }

    @GET('/default/badRequest')
    public static responseBadRequest() {
      return Response.BadRequest();
    }

    @GET('/default/unauthorized')
    public static responseUnauthorized() {
      return Response.Unauthorized();
    }

    @GET('/default/paymentRequired')
    public static responsePaymentRequired() {
      return Response.PaymentRequired();
    }

    @GET('/default/forbidden')
    public static responseForbidden() {
      return Response.Forbidden();
    }

    @GET('/default/notFound')
    public static responseNotFound() {
      return Response.NotFound();
    }

    @GET('/default/methodNotAllowed')
    public static responseMethodNotAllowed() {
      return Response.MethodNotAllowed();
    }

    @GET('/default/notAcceptable')
    public static responseNotAcceptable() {
      return Response.NotAcceptable();
    }

    @GET('/default/conflict')
    public static responseConflict() {
      return Response.Conflict();
    }

    @GET('/default/noLongerAvailable')
    public static responseNoLongerAvailable() {
      return Response.Gone();
    }

    @GET('/default/error')
    public static responseError() {
      return Response.Error();
    }

    @GET('/default/notImplemented')
    public static responseNotImplemented() {
      return Response.NotImplemented();
    }

    @GET('/default/badGateway')
    public static responseBadGateway() {
      return Response.BadGateway();
    }

    @GET('/default/temporarilyUnavailable')
    public static responseTemporarilyUnavailable() {
      return Response.TemporarilyUnavailable();
    }

    @GET('/default/gatewayTimeout')
    public static responseGatewayTimeout() {
      return Response.GatewayTimeout();
    }

    @GET('/code')
    @ResponseCode(402)
    public static getCode() {
      return 'foo';
    }

    @GET('/errorCode')
    @ErrorCode(402)
    public static getErrorCode(): Promise<any> {
      return Promise.reject('foo');
    }

    @GET('/errorCodeRule')
    @Rule('ErrorRule')
    public static getErrorCodeFromRule() {
      return 'foo';
    }

    @GET('/errorCodeResource')
    public static getErrorResourceFromRule(@Resource('ErrorResource') res: any) {
      return 'foo';
    }
}