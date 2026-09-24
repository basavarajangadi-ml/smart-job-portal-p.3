import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/dbService';
import { getAuthUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const notifications = await dbService.getNotifications(authUser.userId);
    const unreadCount = notifications.filter((n: any) => !n.isRead).length;

    return NextResponse.json(
      {
        success: true,
        notifications,
        unreadCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { id, markAll } = body;

    if (markAll) {
      await dbService.markAllNotificationsAsRead(authUser.userId);
      return NextResponse.json(
        { success: true, message: 'All notifications marked as read' },
        { status: 200 }
      );
    }

    if (id) {
      const updated = await dbService.markNotificationAsRead(id, authUser.userId);
      return NextResponse.json(
        { success: true, notification: updated },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Notification ID required' },
        { status: 400 }
      );
    }

    await dbService.deleteNotification(id, authUser.userId);
    return NextResponse.json(
      { success: true, message: 'Notification deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete notification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error deleting notification' },
      { status: 500 }
    );
  }
}
