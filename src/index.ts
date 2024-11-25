import xior, { type XiorInstance } from "xior";
import type {
  ContactMessageParam,
  InteractiveMessageParam,
  LocationMessageParam,
  MessageContext,
  ReactionMessageParam,
  TextMessageParam,
} from "./types/client";

export default class WhatsApp {
  private readonly client: XiorInstance;
  private commonParams = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
  };

  constructor(phoneNumberId: string, accessToken: string) {
    this.client = xior.create({
      baseURL: `https://graph.facebook.com/v20.0/${phoneNumberId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  sendTextMessage(
    to: string,
    text: TextMessageParam,
    context?: MessageContext,
  ) {
    return this.client.post("/messages", {
      to,
      text,
      context,
      type: "text",
      ...this.commonParams,
    });
  }

  sendReactionMessage(to: string, reaction: ReactionMessageParam) {
    return this.client.post("/messages", {
      to,
      reaction,
      type: "reaction",
      ...this.commonParams,
    });
  }

  sendLocationMessage(
    to: string,
    location: LocationMessageParam,
    context?: MessageContext,
  ) {
    return this.client.post("/messages", {
      to,
      context,
      location,
      type: "location",
      ...this.commonParams,
    });
  }

  sendContactMessage(
    to: string,
    contacts: ContactMessageParam[],
    context?: MessageContext,
  ) {
    return this.client.post("/messages", {
      to,
      context,
      contacts,
      type: "contacts",
      ...this.commonParams,
    });
  }

  sendInteractiveMessage(to: string, interactive: InteractiveMessageParam) {
    return this.client.post("/messages", {
      to,
      type: "interactive",
      interactive,
      ...this.commonParams,
    });
  }

  private chain(to: string, message_id?: string) {
    const messageCtx = message_id ? { message_id } : undefined;
    return {
      text: (body: string, preview_url?: boolean) => ({
        send: () =>
          this.sendTextMessage(
            to,
            {
              body,
              preview_url,
            },
            messageCtx,
          ),
      }),
      contacts: (param: ContactMessageParam[]) => ({
        send: () => this.sendContactMessage(to, param, messageCtx),
      }),
      location: (param: LocationMessageParam) => ({
        send: () => this.sendLocationMessage(to, param, messageCtx),
      }),
      react: (emoji: string) => ({
        send: () =>
          this.sendReactionMessage(to, {
            message_id: message_id as string,
            emoji,
          }),
      }),
    };
  }

  message(to: string) {
    return {
      reply: (message_id: string) => this.chain(to, message_id),
      ...(this.chain(to) as Omit<ReturnType<WhatsApp["chain"]>, "react">),
    };
  }

  read(message_id: string) {
    return this.client.post("/messages", {
      message_id,
      status: "read",
      messaging_product: "whatsapp",
    });
  }
}
