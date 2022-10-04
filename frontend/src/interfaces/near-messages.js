import { utils } from 'near-api-js';

const THIRTY_TGAS = '30000000000000';

export class NearMessages {
  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;

    console.log(`this.wallet`, this.wallet);
  }

  /**
   * Room by ID
   * @param id
   * @returns {Promise<any>}
   */
  async getRoomById(id) {
    return await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'get_room_by_id',
      args: {
        id
      }
    });
  }

  /**
   * Get owned rooms
   * @returns {Promise<any>}
   */
  async getOwnerRooms() {
    const account = "...";

    return await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'get_owner_rooms',
      args: {
        account
      }
    });
  }

  /**
   * Get rooms that user joined
   * @returns {Promise<any>}
   */
  async getUserRooms() {
    const account = "...";

    return await this.wallet.viewMethod({
      contractId: this.contractId,
      method: 'get_user_rooms',
      args: {
        account
      }
    });
  }

  /**
   * Create room
   * @param title
   * @param media
   * @param is_private
   * @param is_read_only
   * @param members
   * @returns {Promise<*>}
   */
  async createNewRoom(title, media, is_private, is_read_only, members) {
    const deposit = utils.format.parseNearAmount("0.25");
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'create_new_room',
      args: {
        title,
        media,
        is_private,
        is_read_only,
        members
      },
      THIRTY_TGAS,
      deposit
    })
  }

  /**
   * Edit Room
   * @param room_id
   * @param title
   * @param media
   * @param is_private
   * @param is_read_only
   * @returns {Promise<*>}
   */
  async editRoom(room_id, title, media, is_private, is_read_only) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'edit_room',
      args: {
        room_id,
        title,
        media,
        is_private,
        is_read_only,
      }
    })
  }

  /**
   * Add room members
   * @param room_id
   * @param members
   * @returns {Promise<*>}
   */
  async ownerAddRoomMembers(room_id, members) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'owner_add_room_members',
      args: {
        room_id,
        members
      }
    })
  }

  /**
   * Remove room members
   * @param room_id
   * @param members
   * @returns {Promise<*>}
   */
  async ownerRemoveRoomMembers(room_id, members) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'owner_remove_room_members',
      args: {
        room_id,
        members
      }
    })
  }

  /**
   * Remove room
   * @param room_id
   * @param confirm_title
   * @returns {Promise<*>}
   */
  async ownerRemoveRoom(room_id, confirm_title) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'owner_remove_room',
      args: {
        room_id,
        confirm_title
      }
    })
  }

  /**
   * Join Public room
   * @param room_id
   * @returns {Promise<*>}
   */
  async join_public_room(room_id) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'join_public_room',
      args: {
        room_id,
      }
    })
  }

  /**
   * Leave room
   * @param room_id
   * @returns {Promise<*>}
   */
  async leave_room(room_id) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'leave_room',
      args: {
        room_id,
      }
    })
  }

  /**
   * Send message to Account
   * @param text
   * @param to_user
   * @param reply_message_id
   * @returns {Promise<*>}
   */
  async sendPrivateMessage(text, to_user, reply_message_id) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'send_private_message',
      args: {
        text,
        to_user,
        reply_message_id
      }
    })
  }

  /**
   * Send message to the room
   * @param text
   * @param to_room
   * @param reply_message_id
   * @returns {Promise<*>}
   */
  async sendRoomMessage(text, to_room, reply_message_id) {
    return await this.wallet.callMethod({
      contractId: this.contractId,
      method: 'send_room_message',
      args: {
        text,
        to_room,
        reply_message_id
      }
    })
  }


}