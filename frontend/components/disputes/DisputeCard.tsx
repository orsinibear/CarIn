'use client';

import { DisputeDetails, ResolutionType } from '@/lib/contracts/disputeResolution';
import { formatEvidenceType } from '@/lib/utils/evidenceHandler';
import { formatDistanceToNow } from 'date-fns';

interface DisputeCardProps {
  dispute: DisputeDetails;
  onClick?: () => void;
}

export default function DisputeCard({ dispute, onClick }: DisputeCardProps) {
  const formatResolutionType = (type: ResolutionType) => {
    switch (type) {
      case ResolutionType.Automated:
        return 'Automated';
      case ResolutionType.PendingVote:
        return 'Pending Vote';
      case ResolutionType.Manual:
        return 'Manual Review';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    if (dispute.isResolved) {
      return dispute.refundApproved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = () => {
    if (dispute.isResolved) {
      return dispute.refundApproved
        ? `Resolved - ${Number(dispute.refundPercentage)}% Refund Approved`
        : 'Resolved - Refund Denied';
    }
    return formatResolutionType(dispute.resolutionType);
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Dispute #{dispute.disputeId.toString()}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Booking #{dispute.bookingId.toString()} • Escrow #{dispute.escrowId.toString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 line-clamp-2">{dispute.reason}</p>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          <p>
            Filed by: <span className="font-medium">{dispute.filedBy.slice(0, 6)}...{dispute.filedBy.slice(-4)}</span>
          </p>
          <p className="mt-1">
            Filed {formatDistanceToNow(new Date(Number(dispute.filedAt) * 1000), { addSuffix: true })}
          </p>
        </div>
        {dispute.isResolved && dispute.resolvedAt > 0n && (
          <div className="text-right">
            <p className="font-medium">Resolved</p>
            <p className="text-xs mt-1">
              {formatDistanceToNow(new Date(Number(dispute.resolvedAt) * 1000), { addSuffix: true })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

