import feedback from './feedback'
import matching from './matching'
import scoring from './scoring'
import time_estimates from './time_estimates'

const time = () => (new Date()).getTime()

function zxcvbn(password, user_inputs) {
  if (user_inputs == null) { user_inputs = [] }
  const start = time()
  // reset the user inputs matcher on a per-request basis to keep things stateless
  const sanitized_inputs = []
  for (const arg of Array.from(user_inputs)) {
    if (['string', 'number', 'boolean'].includes(typeof arg)) {
      sanitized_inputs.push(arg.toString().toLowerCase())
    }
  }
  matching.set_user_input_dictionary(sanitized_inputs)
  const matches = matching.omnimatch(password)
  const result = scoring.most_guessable_match_sequence(password, matches)
  result.calc_time = time() - start
  const attack_times = time_estimates.estimate_attack_times(result.guesses)
  for (const prop in attack_times) {
    const val = attack_times[prop]
    result[prop] = val
  }
  result.feedback = feedback.get_feedback(result.score, result.sequence)
  return result
}

export default zxcvbn
