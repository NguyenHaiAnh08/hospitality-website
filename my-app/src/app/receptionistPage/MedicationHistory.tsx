import React, { useState } from 'react';
import { SearchIcon, CalendarIcon, PillIcon } from 'lucide-react';

export function MedicationHistory() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock medication data
  const [medications] = useState([{
    id: 1,
    name: 'Nguyễn Văn A',
    nationalId: '001201012345',
    date: '15/05/2023',
    doctor: 'Bs. Nguyễn Văn X',
    diagnosis: 'Viêm họng',
    medications: [{
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: '3 lần/ngày',
      duration: '5 ngày'
    }, {
      name: 'Strepsils',
      dosage: '1 viên',
      frequency: '4 lần/ngày',
      duration: '5 ngày'
    }]
  }, {
    id: 2,
    name: 'Trần Thị B',
    nationalId: '001201054321',
    date: '15/05/2023',
    doctor: 'Bs. Trần Thị Y',
    diagnosis: 'Cảm cúm',
    medications: [{
      name: 'Panadol',
      dosage: '500mg',
      frequency: '3 lần/ngày',
      duration: '3 ngày'
    }, {
      name: 'Vitamin C',
      dosage: '1000mg',
      frequency: '1 lần/ngày',
      duration: '7 ngày'
    }]
  }, {
    id: 3,
    name: 'Lê Văn C',
    nationalId: '001201098765',
    date: '14/05/2023',
    doctor: 'Bs. Nguyễn Văn X',
    diagnosis: 'Đau lưng',
    medications: [{
      name: 'Ibuprofen',
      dosage: '400mg',
      frequency: '2 lần/ngày',
      duration: '7 ngày'
    }, {
      name: 'Myonal',
      dosage: '50mg',
      frequency: '3 lần/ngày',
      duration: '5 ngày'
    }]
  }]);
  
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    med.nationalId.includes(searchTerm)
  );
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Lịch sử thuốc</h1>
        <p className="text-gray-600 mt-2">Xem lịch sử thuốc đã kê cho bệnh nhân</p>
      </div>
      
      {/* Main content container */}
      <div className="border border-gray-300 rounded-xl shadow-sm overflow-hidden bg-white">
        {/* Search and date pickers */}
        <div className="p-6 border-b border-gray-300 bg-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-black" />
              </div>
              <input 
                type="text" 
                placeholder="Tìm theo TÊN hoặc CCCD..." 
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black shadow-sm transition-all text-black placeholder-gray-500" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex flex-col">
                <label htmlFor="start-date" className="block text-sm font-medium text-black mb-1 pl-1">Từ ngày</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon size={16} className="text-black" />
                  </div>
                  <input
                    id="start-date"
                    type="date"
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black shadow-sm transition-all text-black"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="end-date" className="block text-sm font-medium text-black mb-1 pl-1">Đến ngày</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon size={16} className="text-black" />
                  </div>
                  <input
                    id="end-date"
                    type="date"
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black shadow-sm transition-all text-black"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Records content */}
        <div className="p-6">
          {filteredMedications.length > 0 ? (
            <div className="space-y-6">
              {filteredMedications.map(record => (
                <div key={record.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="border-b border-gray-300 bg-gradient-to-r from-gray-50 to-white p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {record.name}
                      </h3>
                      <p className="text-sm text-gray-700 mt-0.5">
                        CCCD: {record.nationalId}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Ngày khám</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{record.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Bác sĩ</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{record.doctor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">Chẩn đoán</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{record.diagnosis}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <PillIcon size={18} className="mr-2 text-indigo-600" />
                      Danh sách thuốc
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-gray-300">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Tên thuốc
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Liều lượng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Tần suất
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
                              Thời gian dùng
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                          {record.medications.map((med, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {med.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {med.dosage}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {med.frequency}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {med.duration}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
              <PillIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                Không tìm thấy dữ liệu
              </h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc để xem kết quả
              </p>
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-8 flex justify-between items-center border-t border-gray-200 pt-5">
            <p className="text-sm text-black">
              Hiển thị <span className="font-medium">{filteredMedications.length}</span> kết quả
            </p>
            <div className="inline-flex shadow-sm rounded-md">
              <button className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors">
                Trước
              </button>
              <button className="px-4 py-2 bg-gray-200 text-black text-sm font-medium border border-gray-300 relative -ml-px hover:bg-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-black rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}