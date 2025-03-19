"use client";
import { useState } from "react";

export default function BossGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 bg-gray-100 shadow-md rounded mb-4">
      <h2 className="text-lg font-bold mb-2">📝 보스 젠 타이머 사용 가이드</h2>
      <p>보스 처치 시간을 기록하고, 다음 젠 시간을 계산해 알려주는 시스템입니다.</p>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isExpanded ? "닫기 ▲" : "처음 사용하시나요? ▼"}
      </button>

      {isExpanded && (
        <div className="mt-4 text-gray-800">
          <h3 className="font-bold text-lg">📌 기본 사용법</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>+ 버튼을 눌러 보스 정보를 입력하고 타이머를 생성합니다.</li>
            <li><span className="font-semibold">게임 이름, 보스 이름, 리젠 시간</span>은 필수 입력입니다.</li>
            <li><span className="font-semibold">처치 버튼</span>을 누르면 현재 시간이 자동 저장되고, 리젠 시간이 계산됩니다.</li>
            <li><span className="font-semibold">+ 수기로 보스 처치 입력하기</span>를 통해 직접 처치 시간을 입력할 수도 있습니다.</li>
          </ul>

          <h3 className="font-bold mt-4">🛠 주요 기능</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>게임별 그룹화</strong>로 보기 편하게 정리됩니다.</li>
            <li>타이머는 <strong>남은 시간이 가장 짧은 순으로 자동 정렬</strong>됩니다.</li>
            <li>남은 시간이 <span className="text-red-500 font-semibold">5분 이내</span>일 경우 <span className="text-red-500 font-semibold">"⚠️ 곧 등장합니다!"</span>가 표시됩니다.</li>
            <li><strong>처치 완료 시</strong> 다음 젠 시간이 자동으로 계산됩니다.</li>
            <li><strong>젠 완료 상태</strong>가 되면 <span className="text-red-500 font-semibold">"⚠️ 젠 완료!"</span>로 표시됩니다.</li>
          </ul>

          <h3 className="font-bold mt-4">✍ 수기 입력 및 수정</h3>
          <ul className="list-disc ml-5 space-y-1">
            <li>타이머 옆 <strong>[수정]</strong> 버튼으로 모든 정보를 수정할 수 있습니다.</li>
            <li>처치 시간을 직접 입력하고 리젠 시간도 수정 가능합니다.</li>
            <li>수정 완료 시, 젠 시간과 처치 시간이 다시 계산됩니다.</li>
          </ul>

          <h3 className="font-bold mt-4">📊 예시 화면</h3>
          <div className="mt-3">
            <img src="/images/timer_sort_example.png" alt="타이머 정렬 예시" className="w-full rounded shadow" />
            <p className="text-center text-sm text-gray-600">👆 남은 시간이 가장 짧은 순으로 정렬된 예시</p>
          </div>

          <div className="mt-3">
            <img src="/images/boss_alert_example.png" alt="보스 경고 예시" className="w-full rounded shadow" />
            <p className="text-center text-sm text-gray-600">👆 보스 젠 5분 전 경고 메시지 예시</p>
          </div>

          <h3 className="font-bold mt-4">❓ 자주 묻는 질문</h3>
          <p className="mt-2"><strong>Q.</strong> 보스 처치 시간을 다시 입력하고 싶은데요?</p>
          <p><strong>A.</strong> 수정 버튼을 누르고 새로운 처치 시간과 리젠 시간을 입력 후 저장하시면 됩니다.</p>

          <p className="text-sm text-gray-500 mt-4">✅ 추가 문의사항은 언제든 알려주세요!</p>
        </div>
      )}
    </div>
  );
}
