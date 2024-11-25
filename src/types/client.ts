export type MessageContext = {
  message_id: string;
};

export type TextMessageParam = {
  preview_url?: boolean;
  body: string;
};

export type ReactionMessageParam = {
  message_id: string;
  emoji: string;
};

export type ContactMessageParam = {
  addresses?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    type?: string;
  }[];
  birthday?: `${string}-${string}-${string}`;
  emails?: {
    email?: string;
    type?: string;
  }[];
  name: {
    formatted_name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    suffix: string;
    prefix: string;
  };
  org?: {
    company?: string;
    department?: string;
    title?: string;
  };
  phones?: {
    phone?: string;
    type?: string;
    wa_id?: string;
  }[];
  urls?: {
    url?: string;
    type?: string;
  }[];
};

export type LocationMessageParam = {
  longitude: number;
  latitude: number;
  name?: string;
  address?: string;
};

export type InteractiveList = {
  type: "list";
  header?: {
    type: "text";
    text: string;
  };
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: {
    sections: {
      title: string;
      rows: {
        id: string;
        title: string;
        description?: string;
      }[];
    }[];
    button: string;
  };
};

export type InteractiveCTA = {
  type: "cta_url";
  header?: {
    type: "text";
    text: string;
  };
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: {
    name: "cta_url";
    parameters: {
      display_text: string;
      url: string;
    };
  };
};

export type Asset<T extends string> = {
  type: T;
} & {
    [key in T]: {
      id?: string;
      url?: string;
    };
  };

export type InteractiveButton = {
  type: "button";
  header?:
  | {
    type: "text";
    text: string;
  }
  | Asset<"document">
  | Asset<"image">
  | Asset<"video">;
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: {
    buttons: {
      type: "reply";
      reply: {
        id: string;
        title: string;
      };
    }[];
  };
};

export type InteractiveLocation = {
  type: "location_request_message";
  body: {
    text: string;
  };
  action: {
    name: "send_location";
  };
};

export type InteractiveFlowNavigate = {
  flow_action: "navigate";
  flow_action_payload: {
    screen: string;
    data: Record<string, number | boolean | string>;
  };
};

export type InteractiveFlow = {
  type: "flow";
  action: {
    name: "flow";
    parameters: {
      mode: "draft" | "published";
      flow_message_version: "3";
      flow_token: string;
      flow_id: string;
      flow_cta: string;
    } & ({ flow_action: "data_exchange" } | InteractiveFlowNavigate);
  };
};

export type InteractiveAddressValues = {
  SG: {
    name?: string;
    phone_number?: string;
    sg_pin_code?: string;
    address?: string;
    unit_number?: string;
    city?: string;
  };
  IN: {
    name?: string;
    phone_number?: string;
    in_pin_code?: string;
    floor_number?: string;
    building_name?: string;
    address?: string;
    landmark_area?: string;
    city?: string;
  };
};

export type InteractiveAddressParameter<T extends keyof InteractiveAddressValues> = {
  country: T;
  values?: InteractiveAddressValues[T];
  validation_errors?: Record<keyof InteractiveAddressValues[T], string>;
  saved_addresses?: {
    id: string;
    value: InteractiveAddressValues[T];
  }[];
};

export type InteractiveAddress = {
  type: "address_message";
  body: {
    text: string;
  };
  action: {
    name: "address_message";
    parameters:
    | InteractiveAddressParameter<"IN">
    | InteractiveAddressParameter<"SG">;
  };
};

export type InteractiveMessageParam =
  | InteractiveCTA
  | InteractiveFlow
  | InteractiveButton
  | InteractiveLocation
  | InteractiveList
  | InteractiveAddress;
