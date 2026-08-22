import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { getTourPackageDetail } from '../../services/tour-package.service';
import { useBooking } from '../../hooks/useBooking';

/**
 * PackageDetailRedirect — loads a package by ID, pre-selects it in booking context,
 * then navigates to /booking/package. Shows loading state while fetching.
 */
export default function PackageDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updatePackage } = useBooking();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/packages', { replace: true });
      return;
    }

    getTourPackageDetail(Number(id))
      .then(res => {
        const p = res.data;
        if (!p) {
          navigate('/packages', { replace: true });
          return;
        }
        updatePackage({
          id: String(p.id),
          name: p.nama,
          description: p.deskripsi,
          price: Number(p.harga),
          unit: p.satuan === 'orang' ? 'orang' : 'grup',
          tag: p.tag ?? undefined,
          minParticipants: p.min_participants ?? undefined,
          maxParticipants: p.max_participants ?? undefined,
          image: p.gambar,
          duration: p.durasi,
          includes: p.includes?.map(item => item.item) ?? [],
        });
        navigate('/booking/package', { replace: true });
      })
      .catch(() => {
        setError('Paket tidak ditemukan. Mengalihkan ke halaman paket...');
        setTimeout(() => navigate('/packages', { replace: true }), 2000);
      });
  }, [id, navigate, updatePackage]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f8faff]">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-[#3d518c] text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f8faff]">
      <Loader2 className="w-8 h-8 animate-spin text-[#182cc1]" />
      <p className="text-[#3d518c] text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
        Memuat paket wisata...
      </p>
    </div>
  );
}
