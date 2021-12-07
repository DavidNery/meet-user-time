import convertMillisecondsToDigitalClock from './utils/time';

let participants = {};
let observer;

const checkOpenedMicrophones = () => {
  document.querySelectorAll('.JHK7jb.Nep7Ue').forEach(target => {
    const user = target.parentNode.parentNode.querySelector('[data-self-name="Você"]').innerHTML;
    participants[user] = {
      oldValue: record.oldValue,
      vezes: []
    };

    if (!target.classList.contains('FTMc0c')) {
      participants[user].vezes.push({ opened: new Date().getTime() });
    }
  });
}

const run = target => {

  participants = {};
  checkOpenedMicrophones();
  observer = new MutationObserver(mutations => {
    for (const record of mutations) {
      const { target } = record;
      const { classList } = target;

      const micro = classList.contains('JHK7jb') && classList.contains('Nep7Ue') ? target : null;
      if (micro) {
        const user = micro.parentNode.parentNode.querySelector('[data-self-name="Você"]').innerHTML;
        if (!participants[user]) {
          participants[user] = {
            oldValue: record.oldValue,
            vezes: []
          };
        }

        if (participants[user].oldValue !== record.oldValue) {
          participants[user].oldValue = record.oldValue;
          if (record.target.classList.contains('FTMc0c')) {
            let last = participants[user].vezes[participants[user].vezes.length - 1];
            if (!last || last.closed)
              last = participants[user].vezes[participants[user].vezes.length - 1] = {};
            last.closed = new Date().getTime();
          } else {
            participants[user].vezes.push({ opened: new Date().getTime() });
          }
        }
      }
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['class']
  });

}

const stop = () => {
  if (observer != null) observer.disconnect();
  const finalData = {};

  Object.keys(participants).forEach(participant => {
    const { vezes } = participants[participant];
    finalData[participant] = {};

    finalData[participant].tempo = convertMillisecondsToDigitalClock(vezes.reduce((total, atual) => {
      if (!atual.opened) return total;
      return total + ((atual.closed || new Date().getTime()) - atual.opened);
    }, 0));
    finalData[participant].vezes = vezes.length;
    finalData[participant].detailed = vezes.map(vez => {
      if (!vez.opened) return null;
      return {
        opened: new Date(vez.opened).toLocaleDateString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        opened_ms: vez.opened,
        closed: vez.closed ? new Date(vez.closed).toLocaleDateString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) : new Date().toLocaleDateString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        closed_ms: vez.closed,
      };
    });
  });

  return finalData;
};

export {
  run, stop
};

