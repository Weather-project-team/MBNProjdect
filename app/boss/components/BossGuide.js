"use client";
import { useState } from "react";

export default function BossGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 bg-gray-100 shadow-md rounded mb-4">
      <h2 className="text-lg font-bold mb-2">📝 보스 젠타이머 사용 가이드</h2>
      <p>이 시스템은 보스 처치 시간을 기록하고, 다음 젠 시간을 계산하여 알려줍니다.</p>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isExpanded ? "닫기 ▲" : "처음 사용하시나요? ▼"}
      </button>

      {isExpanded && (
        <div className="mt-4">
          <h3 className="font-bold text-lg">📌 사용 방법</h3>
          <ul className="list-disc ml-5">
            <li>+ 버튼을 눌러 보스 정보를 입력하세요.</li>
            <li>보스 이름과 리젠 시간(예: 4시간)은 필수 입력입니다.</li>
            <li>처치 버튼을 누르면 현재 시간이 자동으로 저장됩니다.</li>
            <li>수기로 입력하고 싶다면 "+ 수기로 보스 처치 입력하기"를 사용하세요.</li>
          </ul>

          {/* ✅ 타이머 정렬 및 알림 설명 추가 */}
          <h3 className="font-bold mt-3">📊 타이머 정렬 및 알림</h3>
          <ul className="list-disc ml-5">
            <li>생성된 타이머는 **젠 시간이 가장 가까운 순서대로 정렬**됩니다.</li>
            <li>보스 젠 시간이 **5분 이내**로 남으면 타이머에 **"⚠️ 곧 보스가 등장합니다!"** 문구가 표시됩니다.</li>
          </ul>

          {/* ✅ 정렬 예제 이미지 추가 */}
          <div className="mt-3">
            <img src="/images/timer_sort_example.png" alt="타이머 정렬 예제" className="w-full rounded shadow" />
            <p className="text-center text-sm text-gray-600">👆 젠 시간이 가까운 순서대로 정렬된 타이머 예제</p>
          </div>

          <h3 className="font-bold mt-3">🕒 예시</h3>
          <p><strong>입력:</strong> 보스 이름: 네바, 리젠 시간: 4시간</p>
          <p><strong>처치 버튼 클릭 →</strong> "03-12 14:30" 자동 저장</p>
          <p><strong>다음 젠 시간:</strong> "03-12 18:30" 자동 계산</p>

          {/* ✅ 5분 전 알림 예제 이미지 추가 */}
          <div className="mt-3">
            <img src="/images/boss_alert_example.png" alt="5분 전 알림 예제" className="w-full rounded shadow" />
            <p className="text-center text-sm text-gray-600">👆 젠 5분 전 경고 문구가 표시된 예제</p>
          </div>

          <h3 className="font-bold mt-3">❓ 자주 묻는 질문</h3>
          <p><strong>Q.</strong> 보스 처치 시간을 수정할 수 있나요?</p>
          <p><strong>A.</strong> "수정" 버튼을 눌러 직접 변경 가능합니다.</p>

          <p className="text-sm text-gray-500 mt-2">추가 질문이 있으면 문의하세요!</p>
        </div>
      )}
    </div>
  );
}
